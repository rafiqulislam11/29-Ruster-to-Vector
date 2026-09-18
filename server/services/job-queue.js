const EventEmitter = require('events');
const db = require('../db/database');
const storage = require('./storage-adapter');
const ai = require('./ai-provider');

class JobQueue extends EventEmitter {
  constructor() {
    super();
    this.queue = [];
    this.activeJobs = new Map();
    this.maxConcurrent = 3;
    this.isProcessing = false;
  }

  /**
   * Enqueue a new processing job
   */
  createJob({ userId, projectId, assetId, tool, parameters = {}, inputUrl = '' }) {
    const jobRecord = db.insert('processing_jobs', {
      user_id: userId,
      project_id: projectId,
      asset_id: assetId,
      tool,
      parameters,
      input_url: inputUrl,
      status: 'queued',
      progress: 0,
      output_url: null,
      error: null,
      started_at: null,
      completed_at: null
    });

    this.queue.push(jobRecord.id);
    this.emit('job:enqueued', jobRecord);
    this.processNext();
    return jobRecord;
  }

  /**
   * Process next jobs in queue
   */
  async processNext() {
    if (this.activeJobs.size >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    const jobId = this.queue.shift();
    const job = db.findById('processing_jobs', jobId);
    if (!job || job.status === 'cancelled') {
      return this.processNext();
    }

    this.activeJobs.set(jobId, job);

    // Update status to processing
    const startedAt = new Date().toISOString();
    db.update('processing_jobs', jobId, {
      status: 'processing',
      progress: 25,
      started_at: startedAt
    });
    this.emit('job:started', { id: jobId, status: 'processing' });

    // Execute job asynchronously
    this.executeJob(job)
      .then(result => {
        db.update('processing_jobs', jobId, {
          status: 'completed',
          progress: 100,
          output_url: result.outputUrl || job.input_url,
          completed_at: new Date().toISOString(),
          metadata: result.metadata || {}
        });

        // Record usage
        const toolConfig = db.findOne('tool_configs', t => t.name.toLowerCase().includes(job.tool.toLowerCase())) || { credit_cost: 1 };
        db.insert('usage', {
          user_id: job.user_id,
          tool: job.tool,
          credits_used: toolConfig.credit_cost
        });

        // Deduct user credits
        const user = db.findById('users', job.user_id);
        if (user && user.credits > 0) {
          db.update('users', user.id, { credits: Math.max(0, user.credits - toolConfig.credit_cost) });
        }

        this.emit('job:completed', { id: jobId, result });
      })
      .catch(err => {
        console.error(`[JobQueue] Job ${jobId} failed:`, err);
        db.update('processing_jobs', jobId, {
          status: 'failed',
          progress: 0,
          error: err.message || 'Processing failed',
          completed_at: new Date().toISOString()
        });
        this.emit('job:failed', { id: jobId, error: err.message });
      })
      .finally(() => {
        this.activeJobs.delete(jobId);
        this.processNext();
      });
  }

  /**
   * Internal job execution simulator / pipeline
   */
  async executeJob(job) {
    // Simulate real pipeline duration (fast enough for immediate responsiveness, realistic for heavy workloads)
    await new Promise(resolve => setTimeout(resolve, 800));

    let outputUrl = job.input_url;
    let metadata = {};

    if (job.tool.includes('upscale')) {
      const res = await ai.upscale.process(job.parameters);
      metadata = res;
    } else if (job.tool.includes('vector')) {
      const res = await ai.vector.process(job.parameters);
      metadata = res;
    } else if (job.tool.includes('remove') || job.tool.includes('transparent')) {
      const res = await ai.bgRemoval.process(job.parameters);
      metadata = res;
    } else {
      metadata = {
        tool: job.tool,
        parameters: job.parameters,
        processed_at: new Date().toISOString()
      };
    }

    return {
      outputUrl,
      metadata
    };
  }

  /**
   * Cancel a job
   */
  cancelJob(jobId) {
    const job = db.findById('processing_jobs', jobId);
    if (!job) return false;

    if (job.status === 'queued') {
      this.queue = this.queue.filter(id => id !== jobId);
    }

    db.update('processing_jobs', jobId, {
      status: 'cancelled',
      completed_at: new Date().toISOString()
    });

    this.activeJobs.delete(jobId);
    this.emit('job:cancelled', { id: jobId });
    return true;
  }

  /**
   * Get queue statistics
   */
  getQueueStats() {
    const allJobs = db.find('processing_jobs');
    return {
      queued: allJobs.filter(j => j.status === 'queued').length,
      active: this.activeJobs.size,
      completed: allJobs.filter(j => j.status === 'completed').length,
      failed: allJobs.filter(j => j.status === 'failed').length,
      total: allJobs.length
    };
  }
}

const jobQueue = new JobQueue();
module.exports = jobQueue;
