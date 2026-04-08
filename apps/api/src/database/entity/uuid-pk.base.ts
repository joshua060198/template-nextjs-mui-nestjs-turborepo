import { BeforeInsert, PrimaryColumn } from "typeorm";

let uuidV7: (() => string) | null = null;

async function getUuidV7() {
  if (!uuidV7) {
    const mod = await import("uuid");
    uuidV7 = mod.v7;
  }
  return uuidV7();
}

export class BaseUUIDEntity<T> {
  @PrimaryColumn("uuid")
  id: T;

  @BeforeInsert()
  async generateId() {
    if (!this.id) {
      this.id = (await getUuidV7()) as T;
    }
  }
}
