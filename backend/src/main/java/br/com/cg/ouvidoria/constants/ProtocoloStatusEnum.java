package br.com.cg.ouvidoria.constants;

public enum ProtocoloStatusEnum {

  RECEBIDO,// Assim que o cidadão envia.
  EM_ANALISE,// Quando a Controladoria começa a ler.
  ENCAMINHADO,//Quando a denúncia foi enviada para o órgão responsável (ex: Secretaria de Saúde).
  CONCLUIDO;//Quando a resposta final é dada ao cidadão.

}
