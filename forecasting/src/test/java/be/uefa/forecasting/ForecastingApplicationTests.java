package be.uefa.forecasting;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import com.google.gson.internal.LinkedTreeMap;
import com.google.gson.reflect.TypeToken;
import com.google.gson.stream.JsonReader;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.json.GsonJsonParser;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.Resource;
import org.springframework.util.Assert;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.UncheckedIOException;
import java.lang.reflect.Type;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@SpringBootTest
class ForecastingApplicationTests {

	private static Type groupMatchesListType = new TypeToken<List<LinkedTreeMap<String, Object>>>() {}.getType();
	private static Gson gson = new Gson();

	@Test
	void contextLoads() {
	}

	@Value("classpath:/ek_2024/*.json")
	private Resource[] groupMatchesResource;

	@Test
	void loadResources() throws IOException {
		Assert.notEmpty(groupMatchesResource, "No matches to load.");

		for (Resource resource: groupMatchesResource) {
			List<?> o = readJson(resource);
		}

	}

	private static List<?> readJson(Resource resource) throws IOException {
		try (Reader reader = new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8)) {
			JsonReader jsonReader = new JsonReader(reader);
			Assert.notNull(jsonReader, "no json read");
			List<LinkedTreeMap<String, Object>> result = gson.fromJson(jsonReader, groupMatchesListType);
			Assert.notEmpty(result, "no json read");
			return result;
		} catch (IOException e) {
			throw e;
		}
	}

}
