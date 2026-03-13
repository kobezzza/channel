declare namespace ts {
  type Pop<A extends any[]> = A extends [_, ...infer R] ? R : [];

  type Cast<A, B> = A extends B ? A : B;
}
