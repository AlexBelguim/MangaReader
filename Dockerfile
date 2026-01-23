FROM ghcr.io/puppeteer/puppeteer:24

# Switch to root to install dependencies and setup directories
USER root

WORKDIR /app

# Copy package files first to leverage cache
COPY package*.json ./

# Install dependencies (ignoring scripts to avoid potential issues during build)
# passing --unsafe-perm might be needed if scripts try to do things, but usually npm ci is fine
RUN npm ci

# Copy source code
# We use the array format to handle the space in "src copy"
COPY ["src copy", "./src"]

# Create directories that will be used for volumes
RUN mkdir -p data downloads

# Run as root to avoid permission issues with mounted volumes
# (Default is root in this stage, so we just don't switch to pptruser)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Expose the server port
EXPOSE 5555

# Set environment variables
ENV NODE_ENV=production

# Start the web server, but sleep if it fails (Debug Mode)
CMD ["sh", "-c", "npm run web || (echo 'App crashed, sleeping...' && sleep infinity)"]
