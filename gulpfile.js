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
		html: [sourse_folder + "/*.html", "!" + sourse_folder + "/_*.html"],
		css: sourse_folder + "/scss/style.scss",//назначаем обработку файла только style.scss т.к собираться все будет в нем 
		js: sourse_folder + "/js/script.js",//тоже самое что и для css
		img: sourse_folder + "/img/**/*.{jpg,png,svg,dif,ico,webp}",//"**/"-означает что мы будем слушать все подпапки которые нах-ся в папке imgв {} указаны расширения которые будут надо смотреть
		fonts: sourse_folder + "/fonts/*.ttf",
	},
	//для файлов котрые надо слушать и сразу изменять готовое
	watch: {
		html: sourse_folder + "/**/*.html",//слушаем и меняем все что html
		css: sourse_folder + "/scss/**/*.scss",
		js: sourse_folder + "/js/**/*.js",
		img: sourse_folder + "/img/**/*.{jpg,png,svg,dif,ico,webp}"

	},
	clean: "./" + project_folder + "/"


}
//присваиваем переменным значения плагинов которые установлены(чтобы посмотреть какие плагины стоят смотри в скобки(''))
let { src, dest } = require('gulp'),
	gulp = require('gulp'),
	browsersync = require('browser-sync').create(),
	fileinclude = require('gulp-file-include'),
	del = require('del'),
	scss = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	group_media = require('gulp-group-css-media-queries'),//плагин для сбора медиа запросов по всему файлу и группировка их в одном месте
	clean_css = require('gulp-clean-css'),//чистит и сжимает css
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify-es').default
	;


function browserSync(params) {
	browsersync.init({
		server: {
			baseDir: "./" + project_folder + "/"

		},
		port: 3000,
		notify: false

	})
}
//функция для изменения файлов html
function html() {
	return src(path.src.html)
		.pipe(fileinclude())//установлен плагин для подключения файлов ,также он является шаблонизатором который позволяет передавть переменные и т.д
		.pipe(dest(path.build.html))//перебрасываю файлы из src в папку ,.pipe - это обращение к gulp(ставится перед командой для него)
		.pipe(browsersync.stream())
}
//функция для изменения файлов css
function css() {
	return src(path.src.css)
		.pipe(scss({
			outputStyle: "expanded"


		})
		)
		.pipe(
			autoprefixer({
				overrideBrowserslist: ["last 5 versions"],
				cascade: true

			})
		)
		.pipe(dest(path.build.css))//перебрасываю файлы из src в папку ,выгрузка полноценного css до сжатия.
		.pipe(clean_css())//сжимаем и чистим css файл*/
		.pipe(rename({
			extname: ".min.css"//после сжатия файла мы его переименовываем для того чтобы можно было получить и полноценный файл тоже в папке distr
		})
		)
		.pipe(
			group_media()
		)

		.pipe(dest(path.build.css))//перебрасываю файлы из src в папку ,выгрузка минифицированного css файла.pipe - это обращение к gulp(ставится перед командой для него)
		.pipe(browsersync.stream())

}
function js() {
	return src(path.src.js)
		.pipe(fileinclude())//установлен плагин для подключения файлов ,также он является шаблонизатором который позволяет передавть переменные и т.д
		.pipe(dest(path.build.js))//перебрасываю файлы из js в папку ,.pipe - это обращение к gulp(ставится перед командой для него)
		.pipe(uglify())//минифицируем js
		.pipe(rename({
			extname: ".min.js"//после сжатия файла мы его переименовываем для того чтобы можно было получить и полноценный файл тоже в папке distr
		})
		)
		.pipe(dest(path.build.js))//перебрасываю файлы из src в папку ,.pipe - это обращение к gulp(ставится перед командой для него)
		.pipe(browsersync.stream())
}
//функция для изменения файлов "на лету"
function watchFiles() {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], js);
}
//функция для очищения папки distr
function clean(params) {
	return del(path.clean);
}
let build = gulp.series(clean, gulp.parallel(js, css, html));
let watch = gulp.parallel(build, watchFiles, browserSync);
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;//когда запускаем gulp по умолчанию выполняется эта строка с переменной watch которая в свою очередь запускает browser-sync