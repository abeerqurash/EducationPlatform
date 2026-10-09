# Batch 142 Fix 1

Preserves typed activity intensity and active state when grouping calendar cells by month. The generic month grouping helper retains the input record shape, so the heatmap can access `intensity` without a TypeScript error. Includes regression coverage. No schema or dependency changes.
