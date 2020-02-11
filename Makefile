build-math:
	cd cao-math && wasm-pack build --release
install-math: build-math
	yarn install --force

