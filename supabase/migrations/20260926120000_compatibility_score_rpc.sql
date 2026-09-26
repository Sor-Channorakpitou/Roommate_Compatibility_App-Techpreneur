-- Return aggregate compatibility scores without exposing either user's quiz answers.
create or replace function public.get_listing_compatibility_scores()
returns table (listing_id text, match_score integer)
language sql
stable
security definer
set search_path = ''
as $$
  with viewer as (
    select response.responses
    from public.compatibility_responses as response
    where response.user_id = auth.uid()
    order by response.completed_at desc, response.id desc
    limit 1
  ), eligible_listings as (
    select listing.id, listing.owner_id
    from public.roommate_listings as listing
    where listing.is_published = true
      and listing.owner_id is not null
      and listing.owner_id <> auth.uid()
  ), latest_owner_answers as (
    select distinct on (response.user_id)
      response.user_id,
      response.responses
    from public.compatibility_responses as response
    join eligible_listings as listing on listing.owner_id = response.user_id
    order by response.user_id, response.completed_at desc, response.id desc
  ), comparisons as (
    select
      listing.id as listing_id,
      count(*) as shared_answers,
      count(*) filter (
        where coalesce(mine.answer ->> 'answer', '') = coalesce(theirs.answer ->> 'answer', '')
          and coalesce(mine.answer ->> 'subAnswer', '') = coalesce(theirs.answer ->> 'subAnswer', '')
      ) as matching_answers
    from eligible_listings as listing
    join latest_owner_answers as owner_answers on owner_answers.user_id = listing.owner_id
    cross join viewer
    cross join lateral jsonb_array_elements(viewer.responses) as mine(answer)
    join lateral jsonb_array_elements(owner_answers.responses) as theirs(answer)
      on theirs.answer ->> 'category' = mine.answer ->> 'category'
    where nullif(btrim(mine.answer ->> 'answer'), '') is not null
      and nullif(btrim(theirs.answer ->> 'answer'), '') is not null
    group by listing.id
  )
  select comparisons.listing_id,
    round(100.0 * comparisons.matching_answers / comparisons.shared_answers)::integer
  from comparisons
  where comparisons.shared_answers > 0;
$$;

revoke all on function public.get_listing_compatibility_scores() from public, anon;
grant execute on function public.get_listing_compatibility_scores() to authenticated;
