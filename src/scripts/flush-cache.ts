import { Cache } from "@/classes/cache.js";

const flushCache = async () => {
	const cache = Cache.getInstance();

	try {
		await cache.flush();
		console.log("Cache limpo com sucesso.");
		process.exit(0);
	} catch (error) {
		console.error("Erro ao limpar o cache:", error);
		process.exit(1);
	}
};

await flushCache();
