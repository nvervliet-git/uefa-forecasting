package be.uefa.forecasting.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "RESULT")
public class ResultEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
