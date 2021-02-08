let project_folder = "dist";//папка для заказчика
let sourse_folder = "#src";//папка с исходниками
//назначаю названия папок которые будут храниться в папке для заказчика и пути к исходникам для этих папок
let path = {
	build: {
		html: project_folder + "/",
		css: project_folder + "/css/",
		js: project_folder + "/js/",
		img: project_folder + "/img/",
		fonts: project_folder + "/fonts/",
	},
	//для папок с исходниками
	src: {
		html: project_folder + "/",
		css: project_folder + "/scss/style.scss",//назначаем обработку файла только style.scss т.к собираться все будет в нем 
		js: project_folder + "/js/script.js",//тоже самое что и для css
		img: project_folder + "/img/**/*.{jpg,png,svg,dif,ico,webp}",//"**/"-означает что мы будем слушать все подпапки которые нах-ся в папке imgв {} указаны расширения которые будут надо смотреть
		fonts: project_folder + "/fonts/*.ttf",
	},
	//для файлов котрые надо слушать и сразу изменять готовое
	watch: {
		html: project_folder + "/**/*.html",//слушаем и меняем все что html
		css: project_folder + "/scss/**/*.scss",
		js: project_folder + "/js/**/*.js",
		img: project_folder + "/img/**/*.{jpg,png,svg,dif,ico,webp}"

	},
	clean: "./" + project_folder + "/"


}
let { src, dest } = require('gulp'),
	gulp = require('gulp'),
	browsersync = require('browser-sync').create();
function browserSync(params) {
	browsersync.init({
		server: {
			baseDir: "./" + project_folder + "/"

		},
		port: 3000,
		notify: false

	})
}
let watch = gulp.parallel(browserSync);
exports.watch = watch;
exports.defolt = watch;//когда запускаем gulp по умолчанию выполняется эта строка с переменной watch которая в свою очередь запускает browser-sync