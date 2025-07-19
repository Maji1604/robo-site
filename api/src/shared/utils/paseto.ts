
import type { AdminRoles } from "@/db/schema";
import * as crypto from "node:crypto";
import type { Footer, Payload } from "paseto-ts/lib/types";
import { decrypt, encrypt, generateKeys } from "paseto-ts/v4";

class PasetoUtil {
  private static secretKey: string = process.env.PASETO_SECRET_KEY || "";
  private static superAdminSecret: string =
    process.env.PASETO_SUPERADMIN_SECRET || "";
  private static shopAdmin: string = process.env.PASETO_SHOP_SECRET || "";

  private static getRandomValues(array: Uint8Array): Uint8Array {
    const bytes = crypto.randomBytes(array.length);
    array.set(bytes);
    return array;
  }

  public static getKey(): string {
    return generateKeys("local", {
      format: "paserk",
      getRandomValues: PasetoUtil.getRandomValues,
    });
  }

  public static async encodePaseto(
    payload: Record<string, string>,
    role: AdminRoles
  ): Promise<string | null> {
    try {
      const key =
        role === "super_admin"
          ? PasetoUtil.superAdminSecret
          : role === "admin"
          ? PasetoUtil.shopAdmin
          : PasetoUtil.secretKey;
      return encrypt(key, payload, {
        addExp: false,
      });
    } catch (error) {
      console.error("Failed to encode Paseto token:", error);
      return null;
    }
  }

  public static async decodePaseto(
    token: string,
    role: AdminRoles
  ): Promise<{
    payload: Payload & { [key: string]: any };
    footer: Footer | string;
  } | null> {
    try {
      const key =
        role === "super_admin"
          ? PasetoUtil.superAdminSecret
          : role === "admin"
          ? PasetoUtil.shopAdmin
          : PasetoUtil.secretKey;
      return decrypt(key, token);
    } catch (error) {
      console.error("Failed to decode Paseto token:", error);
      return null;
    }
  }
}

export { PasetoUtil };
