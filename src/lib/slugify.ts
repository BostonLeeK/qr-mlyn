const UA_MAP: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ie", ж: "zh", з: "z",
  и: "y", і: "i", ї: "i", й: "i", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p",
  р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh",
  щ: "shch", ь: "", ю: "iu", я: "ia", ё: "e", ъ: "",
  А: "a", Б: "b", В: "v", Г: "h", Ґ: "g", Д: "d", Е: "e", Є: "ie", Ж: "zh", З: "z",
  И: "y", І: "i", Ї: "i", Й: "i", К: "k", Л: "l", М: "m", Н: "n", О: "o", П: "p",
  Р: "r", С: "s", Т: "t", У: "u", Ф: "f", Х: "kh", Ц: "ts", Ч: "ch", Ш: "sh",
  Щ: "shch", Ь: "", Ю: "iu", Я: "ia", Ё: "e", Ъ: "",
  э: "e", Э: "e", ы: "y", Ы: "y",
};

export function slugFromTitle(title: string): string {
  let out = "";
  for (const ch of title) {
    out += UA_MAP[ch] ?? ch;
  }
  return out
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    || "proekt";
}
