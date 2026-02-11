"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareShopRadarData = exports.normalizeForRadarChart = void 0;
const normalizeForRadarChart = (shops) => {
    // if (!shops.length) return [];
    const maxValues = {
        followers: Math.max(...shops.map((s) => s.metrics.followers), 1),
        products: Math.max(...shops.map((s) => s.metrics.products), 1),
        orders: Math.max(...shops.map((s) => s.metrics.orders), 1),
        rating: 5,
        sales: Math.max(...shops.map((s) => s.metrics.totalSales), 1),
    };
    const normalizedData = shops.map((s) => {
        const shop = {
            id: s.id,
            name: s.name,
            logo: s.logo,
            followers: Number(((s.metrics.followers / maxValues.followers) * 100).toFixed(2)),
            orders: Number(((s.metrics.orders / maxValues.orders) * 100).toFixed(2)),
            products: Number(((s.metrics.products / maxValues.products) * 100).toFixed(2)),
            rating: Number(((s.metrics.avgRating / maxValues.rating) * 100).toFixed(2)),
            sales: Number(((s.metrics.totalSales / maxValues.sales) * 100).toFixed(2)),
        };
        return shop;
    });
    // console.log(normalizedData);
    return normalizedData;
};
exports.normalizeForRadarChart = normalizeForRadarChart;
const prepareShopRadarData = (normalizedShops) => {
    const labels = ["Followers", "Orders", "Products", "Rating", "Sales"];
    const datasets = normalizedShops.map((s) => ({
        label: s.name,
        data: [s.followers, s.orders, s.products, s.rating, s.sales],
    }));
    return { labels, datasets };
};
exports.prepareShopRadarData = prepareShopRadarData;
