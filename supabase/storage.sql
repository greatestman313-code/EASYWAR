-- إنشاء البكت الأساسي باسم uploads (علني = true)
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do nothing;

-- ✅ سياسة القراءة: أي مستخدم مسجّل يقدر يقرأ من البكت
create policy "Allow read access to uploads"
on storage.objects for select
using (bucket_id = 'uploads');

-- ✅ سياسة الرفع: أي مستخدم مسجّل يقدر يرفع إلى البكت
create policy "Allow insert access to uploads"
on storage.objects for insert
with check (bucket_id = 'uploads');

-- ✅ سياسة التحديث: المستخدم يقدر يحدّث ملفاته فقط
create policy "Allow update own files in uploads"
on storage.objects for update
using (bucket_id = 'uploads' and auth.uid() = owner)
with check (bucket_id = 'uploads' and auth.uid() = owner);

-- ✅ سياسة الحذف: المستخدم يقدر يحذف ملفاته فقط
create policy "Allow delete own files in uploads"
on storage.objects for delete
using (bucket_id = 'uploads' and auth.uid() = owner);
