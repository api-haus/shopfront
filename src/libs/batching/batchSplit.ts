export const batchSplit = <T>(collection: T[] = [], maxLength = 10): T[][] => {
  const batches: T[][] = [];

  const numBatches = Math.ceil(collection.length / maxLength);
  for (let i = 0; i < numBatches; i++) {
    const batch = collection.slice(
      0,
      maxLength,
    );

    batches.push(batch);

    collection = collection.slice(batch.length);
  }

  return batches;
};
