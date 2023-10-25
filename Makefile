.PHONY: build

build:
	node build.js

update: install
	git submodule update --init --recursive
	cd js13k-compiler && git checkout master && git pull && npm install

install:
	git submodule update --init --recursive
	cd js13k-compiler && npm install
	mkdir -p build
