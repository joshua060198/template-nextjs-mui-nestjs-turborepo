import { JobsOptions } from "bullmq";

export const DEFAULT_QUEUE_JOB_OPTIONS: JobsOptions = {
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 5_000,
  },
  removeOnComplete: true,
};
