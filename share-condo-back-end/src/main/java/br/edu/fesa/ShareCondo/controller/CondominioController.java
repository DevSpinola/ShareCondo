package br.edu.fesa.ShareCondo.controller;

import br.edu.fesa.ShareCondo.model.Condominio;
import br.edu.fesa.ShareCondo.model.CondominioDTO; // Novo DTO
import br.edu.fesa.ShareCondo.repositories.CondominioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/condominio")
public class CondominioController {

    @Autowired
    private CondominioRepository condominioRepository;

    @PostMapping
    public ResponseEntity<CondominioDTO> criarCondominio(@RequestBody Condominio condominio) { // Pode-se criar um CondominioRequestDTO aqui
        Condominio novoCondominio = condominioRepository.save(condominio);
        return new ResponseEntity<>(new CondominioDTO(novoCondominio), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CondominioDTO>> listarCondominios() {
        List<CondominioDTO> dtos = condominioRepository.findAll().stream()
                .map(CondominioDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CondominioDTO> buscarCondominioPorId(@PathVariable String id) {
        return condominioRepository.findById(id)
                .map(condominio -> ResponseEntity.ok(new CondominioDTO(condominio)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<CondominioDTO> atualizarCondominio(@PathVariable String id, @RequestBody Condominio condominioAtualizado) { // Pode-se criar um CondominioRequestDTO
        return condominioRepository.findById(id)
                .map(condominio -> {
                    condominio.setNome(condominioAtualizado.getNome());
                    condominio.setEndereco(condominioAtualizado.getEndereco());
                    Condominio salvo = condominioRepository.save(condominio);
                    return ResponseEntity.ok(new CondominioDTO(salvo));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarCondominio(@PathVariable String id) {
        if (!condominioRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        condominioRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}