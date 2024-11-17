"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const stripe_route_1 = require("./modules/stripe/stripe.route");
const ner_route_1 = require("./modules/nerCardX/ner.route");
const extract_route_1 = require("./modules/azureExtractInfo/extract.route");
const app = (0, express_1.default)();
const port = 3014;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api", ner_route_1.NerRoute);
app.use("/api", stripe_route_1.StripeRoute);
app.use("/api", extract_route_1.AzureExtractRoute);
// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the CardX API');
});
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${port}`);
});
