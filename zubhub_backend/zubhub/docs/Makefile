this := $(word $(words $(MAKEFILE_LIST)),$(MAKEFILE_LIST))
PROJECT_DIR := $(dir $(this))
help:
	@echo "Make targets:"
	@echo "============="
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "%-20s %s\n", $$1, $$2}'
.PHONY: help

serve-docs: # serve docs locally using mkdocs-serve.yml config
	mkdocs serve --config-file ./mkdocs-serve.yml
.PHONY: serve-docs

build-docs: # build static site for docs using mkdocs-build.yml
	bash ./pre-build.sh
	mkdocs build --config-file ./mkdocs-build.yml
	bash ./post-build.sh
.PHONY: build-docs