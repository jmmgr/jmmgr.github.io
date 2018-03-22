#makefile
TEX_FILES=$(shell find -name '*.tex')
CLEAN_FILES="*.4ct" "*.4tc" "*.aux" "*.dvi" "*.idv" "*.lg" "*.log" "*.out" "*.tmp" "*.toc" "*.xref"
CLEAN_FILES_ALL="*.pdf" "*.html" "*.css"
default: compile_pdf compile_pdf compile_html clean

clean: clean_css_htl 
	@for f in ${CLEAN_FILES}; do \
   		find . -name "$${f}" -delete; \
   	done

clean_css_htl:
	@for f in $(TEX_FILES); \
	do \
		rm "$${f%/*}.css"; \
		rm "$${f%/*}.html"; \
	done

clean_all: clean
	@for f in ${CLEAN_FILES_ALL}; do \
   		find . -name "$${f}" -delete; \
   	done

compile_pdf: 
	@for f in $(TEX_FILES); \
	do \
		pdflatex -output-directory="$${f%/*}" $$f; \
	done

compile_html:
	for f in $(TEX_FILES); \
	do \
		htlatex $$f "" "" "-d$${f%/*}/"; \
	done

