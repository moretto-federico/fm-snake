
interface SumOp {
  add(v1: number, v2: number): number;
}

class MyMath implements SumOp {
  add(v1: number, v2: number): number {
    return v1 + v2;
  }
}

describe('TypeScript', () => {
  test('create class', () => {
    const sum = new MyMath().add(1, 2);
    expect(sum).toBe(3);
  });
})