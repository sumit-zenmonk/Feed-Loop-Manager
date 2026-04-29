import { Injectable } from '@nestjs/common';
import { FeedbackRepository } from './infrastructure/repository/feedback.repo';

@Injectable()
export class AppService {
  constructor(
    private readonly feedbackRepo: FeedbackRepository,
  ) { }

  getHello(): string {
    return 'Hello World!';
  }

  async getFeedbacks(offset?: number, limit?: number) {
    const curr_limit = limit ?? Number(process.env.page_limit) ?? 10;
    const curr_offset = offset ?? Number(process.env.page_offset) ?? 0;
    const [data, total] = await this.feedbackRepo.getFeedbacks(curr_offset, curr_limit);

    return {
      data: data,
      limit: curr_limit,
      offset: curr_offset,
      totalDocuments: total,
      message: "Feedback Listing Success"
    }
  }

  async getFeedback(uuid: string) {
    const feedback = await this.feedbackRepo.findByUuid(uuid);

    return {
      data: feedback,
      message: "Feedback fetched Success"
    }
  }
}
