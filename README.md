# Teressa: Beneath the Bloom

## Play from a ZIP

Extract `Teressa-Portable.zip`, then double-click `Open Teressa.bat` on Windows. On other computers, open `index.html` in a browser.

The ZIP is a snapshot: changes made to your project will not update copies of the ZIP.

## Publish a shared, auto-updating version

The GitHub Pages workflow in `.github/workflows/deploy-pages.yml` publishes the game whenever changes are pushed to the `main` branch. It also gives each deployment a new service-worker cache version so installed copies can fetch the latest game.

One-time setup:

1. Create a GitHub repository for this project and push the project files and workflow to its `main` branch.
2. In the repository, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**.
3. Wait for the **Deploy Teressa to GitHub Pages** workflow to finish. GitHub displays the live URL in **Settings → Pages**.
4. Share that URL. Players can open it in a browser and install it from the browser menu. To publish changes, push them to `main`; installed copies can then use **Update game** or **Update now**.

For changes to appear on all devices, players must use the shared Pages URL. A separately extracted ZIP remains the version it was when downloaded.
