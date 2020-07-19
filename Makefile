build:
	docker build -t frenetiq/caolo-web-client:latest -f dockerfile .

push: build
	docker push frenetiq/caolo-web-client:latest
