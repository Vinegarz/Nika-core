-- Development-only seed data. Every row is explicitly TEST_DATA.
insert into caller_records
  (phone_e164, display_name, category, spam_score, verified_business, source_kind, source_name, is_test_data)
values
  ('+919876512345', 'TEST DATA · Rahul Sharma', 'Personal', 0, false, 'TEST_DATA', 'Local development seed', true),
  ('+919988777665', 'TEST DATA · Delivery Service', 'Delivery', 12, true, 'TEST_DATA', 'Local development seed', true),
  ('+919123456789', 'TEST DATA · Reported caller', 'Unknown', 92, false, 'TEST_DATA', 'Local development seed', true)
on conflict (phone_e164) do nothing;
