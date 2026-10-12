.DEFAULT_GOAL := help

.PHONY: help install install-desktop install-web dev build build-macos build-windows pack-resources collect-release

help:
	@printf '%s\n' \
	  'make install          Install desktop and web dependencies' \
	  'make install-desktop  Install desktop dependencies' \
	  'make install-web      Install web dependencies in web/' \
	  'make dev              Run the desktop app in development mode' \
	  'make build            Build the desktop app for the current platform' \
	  'make build-macos      Build the universal macOS app and DMG' \
	  'make build-windows    Build the Windows app and installer' \
	  'make pack-resources   Create the shared offline resource archive' \
	  'make collect-release  Collect completed installers and resources'

install: install-desktop install-web

install-desktop:
	npm ci

install-web:
	npm --prefix web ci

dev:
	npm run desktop:dev

build:
	npm run desktop:build

build-macos:
	npm run desktop:build:macos -- --bundles app,dmg --ci

build-windows:
	npm run desktop:build:windows -- --ci

pack-resources:
	npm run desktop:pack:resources

collect-release:
	npm run desktop:release:collect
