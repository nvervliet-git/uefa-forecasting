package be.uefa.forecasting;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;

@Disabled
public class JsonMapperTest {

    @Value("/singleValueAsArray.json")
    private Resource resource;

    @Test
    public void testMapSingleJsonValueToArray()  {

    }
}
