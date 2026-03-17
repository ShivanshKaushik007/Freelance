import { readFile } from "fs/promises";
import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";
export const runtime = "nodejs";

export default async function Icon() {
  const logoPath = new URL("../public/logo.png", import.meta.url);
  const logoBuffer = await readFile(logoPath);
  const logoBase64 = Buffer.from(logoBuffer).toString("base64");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
        }}
      >
        <img
          src={`data:image/png;base64,${logoBase64}`}
          alt="Ayushman Well Baby Hospital"
          width="56"
          height="56"
          style={{ objectFit: "contain" }}
        />
      </div>
    ),
    {
      width: size.width,
      height: size.height,
    }
  );
}
