#
# This is the Makefile for the Blog.
#
# You can find usefull targets for managing the Blog.

SITE_DIR=_site
DEPLOY_DIR=_deploy
DEPLOY_MASTER_DIR=_deploy/master
GITHUB_ORGA="5website"
GITHUB_REPO="5website.github.io"

all: install
	npm run serve


install:
	npm install


prepare_deploy: clean
	@echo "Preparing deployment ..."
	@echo ""

	mkdir ${DEPLOY_DIR}

	cd ${DEPLOY_DIR}/ && \
		git clone --branch master --depth 1 git@github.com:${GITHUB_ORGA}/${GITHUB_REPO} master

	cd ${DEPLOY_DIR}/master && \
    git checkout master


deploy: prepare_deploy
	BUILD_DIR="${DEPLOY_MASTER_DIR}" npm start

	@echo ""
	@echo "------------------------------------------------------------------------"
	@echo ""
	@echo "5Minds Website - These are the changes:"
	@echo ""

	@cd ${DEPLOY_MASTER_DIR} && \
		git add . && \
		git status

	@echo "------------------------------------------------------------------------"
	@echo ""

	@bash yesno.sh "Do you want to push this to production?" && \
		cd ${DEPLOY_MASTER_DIR} && \
		git commit -a -m ":anchor: Build" && \
		git push


serve:
	npm run-script serve


clean:
	rm -rf ${DEPLOY_DIR}
