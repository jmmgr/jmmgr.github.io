#makefile
TEX_FILES=$(shell find -name '*.tex')
CLEAN_FILES="*.4ct" "*.4tc" "*.aux" "*.dvi" "*.idv" "*.lg" "*.log" "*.out" "*.tmp" "*.toc" "*.xref"
CLEAN_FILES_ALL="*.pdf" "*.html" "*.css"

.PHONY: default
default: compile_pdf compile_pdf compile_html clean

.PHONY: clean
clean: clean_css_htl 
	@for f in ${CLEAN_FILES}; do \
   		find . -name "$${f}" -delete; \
   	done

.PHONY: clean_css_htl
clean_css_htl:
	@for f in $(TEX_FILES); \
	do \
		rm "$${f%/*}.css"; \
		rm "$${f%/*}.html"; \
	done

.PHONY: clean_all
clean_all: clean
	@for f in ${CLEAN_FILES_ALL}; do \
   		find . -name "$${f}" -delete; \
   	done

.PHONY: compile_pdf
compile_pdf: 
	@for f in $(TEX_FILES); \
	do \
		pdflatex -output-directory="$${f%/*}" $$f; \
	done

.PHONY: compile_html
compile_html:
	for f in $(TEX_FILES); \
	do \
		htlatex $$f "" "" "-d$${f%/*}/"; \
	done

.PHONY: toc
toc:
	for f in **/*.md;  do markdown-toc -i $$f; done
