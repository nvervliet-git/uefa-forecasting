package be.uefa.forecasting.entity;

import jakarta.persistence.*;

import java.util.Objects;

@Entity
@Table(name = "TEAM")
public class TeamEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;
    @Column(unique = true, nullable = false)
    private String imgUrl;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "group_id")
    private GroupMatchesEntity group;


//    @OneToMany(
//            mappedBy = "match",
//            cascade = CascadeType.ALL,
//            orphanRemoval = true
//    )
//    private List<MatchEntity> matches;

    protected TeamEntity() {
    }


    public TeamEntity(String name, String imgUrl) {
        this.name = name;
        this.imgUrl = imgUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getImgUrl() {
        return imgUrl;
    }

    public void setImgUrl(String imgUrl) {
        this.imgUrl = imgUrl;
    }

    public GroupMatchesEntity getGroup() {
        return group;
    }

    public void setGroup(GroupMatchesEntity group) {
        this.group = group;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TeamEntity that = (TeamEntity) o;
        return Objects.equals(name, that.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name);
    }
}
