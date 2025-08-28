// Middleware отключен - сайт полностью публичен
// Все пользователи могут просматривать и взаимодействовать с контентом

export function middleware() {
  // Никаких ограничений - полный доступ для всех
  return
}

export const config = {
  matcher: [], // Отключаем middleware полностью
}
