import { Segment } from '../fixtures';

export type PointsBySegment = Record<Segment, { increased: number; total: number }>;
