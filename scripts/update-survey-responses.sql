-- After creating the seeker@test.com account, run this to associate survey responses
-- Replace 'USER_ID_HERE' with the actual user ID from the created account

-- First, let's see what user IDs we have
SELECT id, email, created_at FROM auth.users WHERE email IN ('seeker@test.com', 'provider@test.com');

-- Update survey responses to associate with the seeker account
-- You'll need to replace the UUID below with the actual user ID
UPDATE survey_responses 
SET user_id = (SELECT id FROM auth.users WHERE email = 'seeker@test.com' LIMIT 1)
WHERE session_id IN ('dummy-session-1', 'dummy-session-2');

-- Verify the update
SELECT sr.id, sr.session_id, sr.user_id, u.email, sr.answers->>'company_size' as company_size
FROM survey_responses sr
LEFT JOIN auth.users u ON sr.user_id = u.id
WHERE sr.session_id LIKE 'dummy-session-%';
