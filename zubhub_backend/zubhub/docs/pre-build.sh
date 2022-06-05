cp ../../../screenshot.png ./docs/
cp ../../../logo.png ./docs/
cp ../../../README.md ./docs/
cp ../../../CONTRIBUTING.md ./docs/
cp ../../../single_vm_deployment/DEPLOYMENT.md ./docs/

sed -i 's/.\/zubhub_backend\/zubhub\/docs\/docs\//.\//' ./docs/README.md
sed -i 's/.\/single_vm_deployment\//.\//' ./docs/README.md
sed -i 's/.md/\/index.html/' ./docs/README.md