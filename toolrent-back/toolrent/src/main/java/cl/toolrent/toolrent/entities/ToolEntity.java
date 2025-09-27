package cl.toolrent.toolrent.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;

@Entity
@Table(name = "Tool")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ToolEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "toolId")
    private Long toolId;

    @Column(name = "nameTool")
    private String name;

    @Column(name = "category")
    private String category;

    @Column(name = "statusTool")
    private String status;

    @Column(name = "replacementValue")
    private int replacementValue;

    @Column(name = "stock")
    private int stock;
}
