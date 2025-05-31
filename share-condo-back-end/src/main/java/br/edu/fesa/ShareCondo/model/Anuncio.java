package br.edu.fesa.ShareCondo.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "anuncios")
public class Anuncio implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String titulo;
    private String descricao;

    @Enumerated(EnumType.STRING)
    private TipoAnuncio tipoAnuncio; // ITEM ou SERVICO

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario anunciante; // Usuário que criou o anúncio

    private LocalDateTime dataCriacao;
    private boolean ativo; // Para controlar se o anúncio está ativo ou não

    @OneToMany(mappedBy = "anuncio", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Oferta> ofertasRecebidas;

    public Anuncio() {
        this.dataCriacao = LocalDateTime.now();
        this.ativo = true;
    }

    public Anuncio(String titulo, String descricao, TipoAnuncio tipoAnuncio, Usuario anunciante) {
        this.titulo = titulo;
        this.descricao = descricao;
        this.tipoAnuncio = tipoAnuncio;
        this.anunciante = anunciante;
        this.dataCriacao = LocalDateTime.now();
        this.ativo = true;
    }

    // Getters e Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public TipoAnuncio getTipoAnuncio() {
        return tipoAnuncio;
    }

    public void setTipoAnuncio(TipoAnuncio tipoAnuncio) {
        this.tipoAnuncio = tipoAnuncio;
    }

    public Usuario getAnunciante() {
        return anunciante;
    }

    public void setAnunciante(Usuario anunciante) {
        this.anunciante = anunciante;
    }

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }

    public List<Oferta> getOfertasRecebidas() {
        return ofertasRecebidas;
    }

    public void setOfertasRecebidas(List<Oferta> ofertasRecebidas) {
        this.ofertasRecebidas = ofertasRecebidas;
    }
}