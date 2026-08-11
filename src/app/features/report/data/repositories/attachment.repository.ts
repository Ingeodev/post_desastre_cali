import { IndexDb } from "../../../../core/data/local/db";
import { INDEX_DB_STORES } from "../../../../core/data/local/db-stores";
import { AttachmentEntity } from "../entities/attachment.entity";



export class AttachmentRepository {

  constructor(
    private readonly db: IndexDb,
  ) {}

  async save(
    attachment: AttachmentEntity,
  ): Promise<void> {
    await this.db.put(
      INDEX_DB_STORES.attachments,
      attachment,
    );
  }

  async get(
    id: string,
  ): Promise<AttachmentEntity | undefined> {
    return this.db.get<AttachmentEntity>(
      INDEX_DB_STORES.attachments,
      id,
    );
  }

  async getByReport(
    reportId: string,
  ): Promise<AttachmentEntity[]> {

    const attachments =
      await this.db.getAll<AttachmentEntity>(
        INDEX_DB_STORES.attachments,
      );

    return attachments.filter(
      attachment =>
        attachment.reportId === reportId,
    );
  }

  async delete(
    id: string,
  ): Promise<void> {
    await this.db.delete(
      INDEX_DB_STORES.attachments,
      id,
    );
  }
}