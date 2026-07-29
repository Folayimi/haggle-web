export interface LiveIndicatorProps {
  /**
   * Number of live sessions/negotiations
   */
  count: number;

  /**
   * Text shown after the count.
   * Defaults to "Negotiations happening"
   */
  label?: string;
}
