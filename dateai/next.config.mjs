import million from "million/compiler";

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { webpack, isServer, nextRuntime }) => {
        if (isServer && nextRuntime === "nodejs") {
            config.plugins.push(
                new webpack.IgnorePlugin({resourceRegExp: /^aws-crt$/})
            );
        }
        config.module = {
            ...config.module,
            exprContextCritical: false,
        }
        return config;
    },
}

export default million.next(nextConfig, {
    mute: true,
});
