export const shuffleArray = <T>(items: T[]): T[] => {
    const copy = [...items];
  
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
  
    return copy;
  };
  
  export const pickRandomBatch = <T>(items: T[], batchSize: number): T[] => {
    if (items.length <= batchSize) {
      return [...items];
    }
  
    return shuffleArray(items).slice(0, batchSize);
  };