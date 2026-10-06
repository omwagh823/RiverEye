import { InferenceClient } from "@huggingface/inference";

const hf = new InferenceClient(
  process.env.HF_TOKEN
);

export async function analyzeImage(
  imageBuffer,
  contentType = "image/jpeg"
) {
  if (!process.env.HF_TOKEN) {
    throw new Error(
      "HF_TOKEN is missing from .env"
    );
  }

  const imageBlob = new Blob(
    [imageBuffer],
    {
      type: contentType,
    }
  );

  const result =
    await hf.imageClassification({
      model:
        "google/vit-base-patch16-224",
      provider: "hf-inference",
      data: imageBlob,
    });

  return result;
}