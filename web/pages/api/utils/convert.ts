export function mapDataToPolylinesAndDuration(data) {
  const result = data.data.routes[0].sections.map(
    ({ polyline, summary: { duration } }) => [polyline, duration]
  );

  const polylines = JSON.stringify(result.map(([polyline]) => polyline));
  const duration = result.reduce(
    (prev: number, [_, d]: [_: any, d: number]) => prev + d,
    0
  );

  return { polylines, duration };
}

export default { mapDataToPolylinesAndDuration };
