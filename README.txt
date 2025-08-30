UserMenu v1.1 — opens UP and Help pops LEFT (compact 12px)

Install:
1) Copy app/components/UserMenu.js into your project.
2) Use it where the account button lives:
   import UserMenu from '@/app/components/UserMenu';
   <UserMenu email={currentUserEmail || 'guest@example.com'} />
Notes:
- Panel opens upward (above the button).
- Help submenu always opens to the LEFT (toward the content column in RTL layouts).
- Font-size is 12px for all elements in the menu.
- Links are placeholders — replace as needed.
