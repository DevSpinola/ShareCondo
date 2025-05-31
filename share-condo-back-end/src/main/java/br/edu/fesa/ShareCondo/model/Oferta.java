package br.edu.fesa.ShareCondo.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ofertas")
public class Oferta implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "anuncio_id", nullable = false)
    private Anuncio anuncio; // Anúncio ao qual a oferta se refere

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ofertante_id", nullable = false)
    private Usuario ofertante; // Usuário que fez a oferta

    @Enumerated(EnumType.STRING)
    private TipoOferta tipoOferta; // DINHEIRO, ITEM, SERVICO

    @Column(precision = 10, scale = 2)
    private BigDecimal valor; // Usado se tipoOferta for DINHEIRO

    @Column(length = 1000)
    private String descricao; // Detalhes se tipoOferta for ITEM ou SERVICO

    private LocalDateTime dataOferta;

    @Enumerated(EnumType.STRING)
    private StatusOferta status;

    public Oferta() {
        this.dataOferta = LocalDateTime.now();
        this.status = StatusOferta.PENDENTE;
    }

    // Getters e Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Anuncio getAnuncio() {
        return anuncio;
    }

    public void setAnuncio(Anuncio anuncio) {
        this.anuncio = anuncio;
    }

    public Usuario getOfertante() {
        return ofertante;
    }

    public void setOfertante(Usuario ofertante) {
        this.ofertante = ofertante;
    }

    public TipoOferta getTipoOferta() {
        return tipoOferta;
    }

    public void setTipoOferta(TipoOferta tipoOferta) {
        this.tipoOferta = tipoOferta;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public LocalDateTime getDataOferta() {
        return dataOferta;
    }

    public void setDataOferta(LocalDateTime dataOferta) {
        this.dataOferta = dataOferta;
    }

    public StatusOferta getStatus() {
        return status;
    }

    public void setStatus(StatusOferta status) {
        this.status = status;
    }
}