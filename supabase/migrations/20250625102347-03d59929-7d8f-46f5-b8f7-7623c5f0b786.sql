
-- Add display_order column to categories table
ALTER TABLE public.categories 
ADD COLUMN display_order INTEGER DEFAULT 0;

-- Update existing categories with display order using a subquery approach
WITH ordered_categories AS (
  SELECT id, row_number() OVER (ORDER BY created_at) as new_order
  FROM public.categories
)
UPDATE public.categories 
SET display_order = ordered_categories.new_order
FROM ordered_categories
WHERE public.categories.id = ordered_categories.id;
