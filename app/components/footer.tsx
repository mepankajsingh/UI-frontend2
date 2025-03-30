export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-6 dark:border-gray-800 dark:bg-gray-950">
      <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()} UI Explorer. All rights reserved.</p>
      </div>
    </footer>
  );
}
