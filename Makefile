.PHONY: all clean install build package publish lint test watch

# Default target
all: clean install build

# Node modules installation
install:
	npm install

# Clean build artifacts
clean:
	rm -rf out/
	rm -rf *.vsix

# Build the extension
build:
	npm run compile

# Watch mode for development
watch:
	npm run watch

# Run tests
test:
	npm run test

# Lint the code
lint:
	npm run lint

# Package the extension
package:
	npm run package
	@echo "Extension packaged successfully. Check the .vsix file."

# Publish to VS Code Marketplace
publish:
	@echo "Publishing to VS Code Marketplace..."
	vsce publish
	@echo "Extension published successfully!"

# Development workflow
dev: clean install watch

# CI workflow
ci: clean install lint test build package

# Help target
help:
	@echo "Available targets:"
	@echo "  all      : Clean, install dependencies, and build"
	@echo "  clean    : Remove build artifacts"
	@echo "  install  : Install dependencies"
	@echo "  build    : Build the extension"
	@echo "  watch    : Watch mode for development"
	@echo "  test     : Run tests"
	@echo "  lint     : Lint the code"
	@echo "  package  : Create VSIX package"
	@echo "  publish  : Publish to VS Code Marketplace"
	@echo "  dev      : Development workflow (clean, install, watch)"
	@echo "  ci       : CI workflow (clean, install, lint, test, build, package)"