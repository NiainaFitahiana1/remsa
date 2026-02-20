import { google } from "googleapis";
import fs from "fs";

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH,
  scopes: ["https://www.googleapis.com/auth/drive"],
});

const drive = google.drive({ version: "v3", auth });

export async function uploadToDrive(
  filePath: string,
  filename: string,
  sharedDriveId: string
): Promise<{ id: string; webViewLink: string }> {
  const res = await drive.files.create({
    supportsAllDrives: true,
    requestBody: {
      name: filename,
      parents: [sharedDriveId],
    },
    media: {
      body: fs.createReadStream(filePath),
    },
    fields: "id, webViewLink",
  });

  if (!res.data.id || !res.data.webViewLink) {
    throw new Error("Upload Google Drive incomplet");
  }

  return {
    id: res.data.id,
    webViewLink: res.data.webViewLink,
  };
}

export async function deleteFromDrive(fileId: string) {
  await drive.files.delete({
    fileId,
    supportsAllDrives: true,
  });
}
